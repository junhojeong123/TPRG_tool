// '마커를 이동하라'는 의도를 나타내는 데이터 객체입니다.
export class MoveMarkerCommand {
  constructor(
    public readonly markerId: string,
    public readonly newPosition: { x: number; y: number },
    public readonly sceneId: string, // 어느 씬에서 발생한 이벤트인지 식별
  ) {}
}