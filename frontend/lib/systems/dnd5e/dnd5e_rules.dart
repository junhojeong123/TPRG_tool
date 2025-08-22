import '../core/rules_engine.dart';
import '../core/dice.dart';

class Dnd5eRules implements TrpgRules {
  @override
  String get systemId => 'dnd5e';

  int _mod(int score) => ((score - 10) / 2).floor();
  int _prof(int level) => 2 + ((level - 1) / 4).floor();

  @override
  Map<String, dynamic> initialData() => {
    'STR': 10,
    'DEX': 10,
    'CON': 10,
    'INT': 10,
    'WIS': 10,
    'CHA': 10,
    'level': 1,
    'baseAC': 10,
    'shield': false,
  };

  @override
  Map<String, dynamic> derive(Map<String, dynamic> d) {
    int asInt(String k) =>
        (d[k] is int) ? d[k] : int.tryParse('${d[k] ?? 0}') ?? 10;
    final level = asInt('level');
    final prof = _prof(level);
    final dexMod = _mod(asInt('DEX'));
    final wisMod = _mod(asInt('WIS'));
    final ac = (asInt('baseAC')) + dexMod + ((d['shield'] == true) ? 2 : 0);
    final passivePerception =
        10 + wisMod + ((d['perceptionProficient'] == true) ? prof : 0);

    return {
      ...d,
      'mods': {
        'STR': _mod(asInt('STR')),
        'DEX': dexMod,
        'CON': _mod(asInt('CON')),
        'INT': _mod(asInt('INT')),
        'WIS': wisMod,
        'CHA': _mod(asInt('CHA')),
      },
      'prof': prof,
      'AC': ac,
      'passivePerception': passivePerception,
    };
  }

  @override
  List<ValidationIssue> validate(Map<String, dynamic> d) => [];

  @override
  RollResult rollCheck(String kind, Map<String, dynamic> ctx) {
    final adv = ctx['advantage'] as String?; // 'adv' | 'dis' | null
    final mod = (ctx['modifier'] as int?) ?? 0;
    final r = Dice.rollD20(adv);
    final total = r.total + mod;
    final dc = ctx['dc'] as int?;
    final ok = dc == null ? true : total >= dc;
    return RollResult(
      detail:
          'd20${adv == null ? '' : '($adv)'}: ${r.detail} + $mod = $total${dc == null ? '' : " vs DC $dc"}',
      total: total,
      success: ok,
    );
  }
}
