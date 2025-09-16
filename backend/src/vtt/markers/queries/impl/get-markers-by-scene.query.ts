// '특정 씬의 모든 마커를 가져오라'는 의도를 나타내는 데이터 객체입니다.
export class GetMarkersBySceneQuery {
  constructor(public readonly sceneId: string) {}
}