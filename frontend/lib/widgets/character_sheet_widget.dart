import 'package:flutter/material.dart';

class CharacterSheetWidget extends StatelessWidget {
  final String name;
  final int hp;
  final int maxHp;
  final int mp;
  final int maxMp;
  final Map<String, TextEditingController> statControllers;
  final Map<String, TextEditingController> generalControllers;
  final VoidCallback onClose;
  final VoidCallback onSave;

  const CharacterSheetWidget({
    Key? key,
    required this.name,
    required this.hp,
    required this.maxHp,
    required this.mp,
    required this.maxMp,
    required this.statControllers,
    required this.generalControllers,
    required this.onClose,
    required this.onSave,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 8,
      borderRadius: BorderRadius.circular(16),
      color: const Color(0xFFF5EFF7),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '탐사자 정보',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['name'],
                  decoration: InputDecoration(
                    labelText: '이름',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['sex'],
                  decoration: InputDecoration(
                    labelText: '성별',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['age'],
                  decoration: InputDecoration(
                    labelText: '나이',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['job'],
                  decoration: InputDecoration(
                    labelText: '직업',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              SizedBox(height: 12),

              Text(
                '주요 특성치',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              for (var key in [
                '근력',
                '건강',
                '크기',
                '민첩',
                '외모',
                '지능',
                '교육',
                '정신력',
                '행운',
              ])
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: TextFormField(
                    controller: statControllers[key],
                    decoration: InputDecoration(
                      labelText: key,
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              SizedBox(height: 12),

              Text(
                '파생 능력치',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Text('체력: $hp/$maxHp'),
              Text('마력: $mp/$maxMp'),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['damageBonus'],
                  decoration: InputDecoration(
                    labelText: '피해 보너스',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['size'],
                  decoration: InputDecoration(
                    labelText: '체구',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['reason'],
                  decoration: InputDecoration(
                    labelText: '이성',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              SizedBox(height: 12),

              Text(
                '광기/발작 관련',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['temporaryInsanity'],
                  decoration: InputDecoration(
                    labelText: '일시적 광기',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['indefiniteInsanity'],
                  decoration: InputDecoration(
                    labelText: '장기적 광기',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['insanityOutburst'],
                  decoration: InputDecoration(
                    labelText: '광기의 발작',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              SizedBox(height: 12),

              Text(
                '탐사자 기능',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              for (var key in statControllers.keys.where(
                (k) => [
                  '회계',
                  '위협',
                  '관찰력',
                  '인류학',
                  '도약',
                  '은밀행동',
                  '감정',
                  '모국어',
                  '수영',
                  '고고학',
                  '법률',
                  '투척',
                  '자료조사',
                  '추적',
                  '매혹',
                  '오르기',
                  '듣기',
                  '재력',
                  '열쇠공',
                  '크툴루신화',
                  '기계수리',
                  '변장',
                  '의료',
                  '회피',
                  '자연',
                  '자동차운전',
                  '항법',
                  '전기수리',
                  '오컬트',
                  '말재주',
                  '중장비 조작',
                  '근접전(격투)',
                  '설득',
                  '사격(권총)',
                  '사격(라/산)',
                  '심리학',
                  '정신분석',
                  '응급처치',
                  '승마',
                  '역사',
                  '손놀림',
                ].contains(k),
              ))
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: TextFormField(
                    controller: statControllers[key],
                    decoration: InputDecoration(
                      labelText: key,
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              SizedBox(height: 12),

              Text(
                '전투 가능 무기',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['weapon'],
                  decoration: InputDecoration(
                    labelText: '전투 가능 무기',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              SizedBox(height: 12),

              Text(
                '장비 / 소지품 / 현금',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['장비'],
                  decoration: InputDecoration(
                    labelText: '장비',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['소지품'],
                  decoration: InputDecoration(
                    labelText: '소지품',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextFormField(
                  controller: generalControllers['현금'],
                  decoration: InputDecoration(
                    labelText: '현금',
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
              ),
              SizedBox(height: 20),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(onPressed: onClose, child: Text('닫기')),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(onPressed: onSave, child: Text('저장')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
