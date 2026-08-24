'use client';

import { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// マップで選択もしくは検索で決まった「目的地」の情報
export type SelectedDestination = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
};

// 初期表示地点（渋谷付近）
const DEFAULT_CENTER = { lat: 35.656, lng: 139.737 };

type DestinationSetterCardProps = {
  // 選択された情報を親に通知する（作成ボタンで一括保存するため）
  onDestinationSelected?: (destination: SelectedDestination | null) => void;
};

export function DestinationSetterCard({
  onDestinationSelected,
}: DestinationSetterCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return (
    // libraries: ['places'] で検索(オートコンプリート)用ライブラリも先に読み込む
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <DestinationSetterContent onDestinationSelected={onDestinationSelected} />
    </APIProvider>
  );
}

type DestinationSetterContentProps = {
  onDestinationSelected?: (destination: SelectedDestination | null) => void;
};

function DestinationSetterContent({
  onDestinationSelected,
}: DestinationSetterContentProps) {
  const map = useMap();
  const places = useMapsLibrary('places');
  const apiLoaded = useApiIsLoaded();

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<SelectedDestination | null>(null);
  const [locationsSearchable, setLocationsSearchable] = useState(false);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  // 選択中の目的地を親コンポーネントへ通知する（作成ボタンでの保存に使う）
  useEffect(() => {
    onDestinationSelected?.(selected);
  }, [selected, onDestinationSelected]);

  // 検索ボックスに Google Places のオートコンプリートを割り当てる
  useEffect(() => {
    if (!places || !searchInputRef.current) return;

    const autocomplete = new places.Autocomplete(searchInputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      types: ['geocode', 'establishment'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      if (!location) {
        return; // 座標が得られない候補は無視
      }

      const lat = location.lat();
      const lng = location.lng();
      setSelected({
        name: place.name ?? place.formatted_address ?? '検索した場所',
        address: place.formatted_address ?? '',
        latitude: lat,
        longitude: lng,
        placeId: place.place_id ?? undefined,
      });

      // 候補の場所へ視点を移動
      mapRef.current?.panTo({ lat, lng });
    });

    return () => {
      listener.remove();
    };
  }, [places]);

  // Places API の読み込み完了を UI に反映する
  useEffect(() => {
    if (!apiLoaded || !places) return;
    setLocationsSearchable(true);
  }, [apiLoaded, places]);

  // マップをクリックした位置にピンを立てて、座標から住所を逆引きする
  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    setSelected({
      name: 'ピンの位置',
      address: '',
      latitude: latLng.lat,
      longitude: latLng.lng,
    });

    void reverseGeocode(latLng.lat, latLng.lng);
  };

  // 座標から住所を取得する（逆ジオコーディング）
  const reverseGeocode = async (lat: number, lng: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${encodeURIComponent(apiKey)}`
      );
      const json = (await res.json()) as {
        results?: { formatted_address?: string }[];
      };
      const address = json.results?.[0]?.formatted_address ?? '';
      setSelected((current) =>
        current
          ? {
              ...current,
              name: address || current.name,
              address: address || current.address,
            }
          : current
      );
    } catch {
      // 逆ジオコーディングに失敗してもピンと座標は残す
    }
  };

  return (
    <div className="space-y-3">
      {/* 場所の検索 */}
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="場所を検索して選択"
          className="rounded-lg pl-8"
        />
        {!locationsSearchable && (
          <p className="mt-1 text-xs text-muted-foreground">
            検索機能を読み込み中…
          </p>
        )}
      </div>

      {/* Google マップ（親要素に高さを指定しないと高さ0になり表示されない） */}
      <div
        className="relative w-full overflow-hidden rounded-lg border"
        style={{ height: '320px' }}
      >
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={16}
          style={{ width: '100%', height: '100%' }}
          onClick={handleMapClick}
          // 航空写真（衛星・地形ビュー）を利用できないように、
          // 地図タイプを「通常の地図(roadmap)」に制限する
          mapTypeId="roadmap"
          mapTypeControlOptions={{
            mapTypeIds: ['roadmap'],
          }}
          // ストリートビューの黄色人（ペグマン）を表示しない
          streetViewControl={false}
        >
          {selected && (
            <Marker
              position={{ lat: selected.latitude, lng: selected.longitude }}
              title={selected.name}
            />
          )}
        </Map>
      </div>

      {/* 選択中の目的地の情報 */}
      {selected ? (
        <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="font-medium truncate">{selected.name}</p>
            {selected.address && (
              <p className="truncate text-muted-foreground">{selected.address}</p>
            )}
            <p className="text-xs text-muted-foreground">
              緯度 {selected.latitude.toFixed(6)} / 経度 {selected.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          地図をタップするか、上の検索ボックスから目的地を選択してください。
        </p>
      )}

      {/* 保存は「作成」ボタンで一括実行される */}
      {selected && (
        <p className="text-xs text-muted-foreground">
          選択した目的地は「作成」ボタンで一緒に保存されます。
        </p>
      )}
    </div>
  );
}
