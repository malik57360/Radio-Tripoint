# nbsp.py <entree.json> <sortie.json> : espaces insécables du français (avant : ; ! ?, et dans « »).
import json, re, sys
d = json.load(open(sys.argv[1]))
fr = d["langues"]["fr"]
for k, v in fr.items():
    v = re.sub(r" ([:;!?»])", " \\1", v)
    v = re.sub(r"« ", "« ", v)
    fr[k] = v
json.dump(d, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
