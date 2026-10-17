# Oreille de Tripo — modèle de reconnaissance vocale

Zipformer « streaming » français pour sherpa-onnx (k2-fsa), version int8 :
`sherpa-onnx-streaming-zipformer-fr-2023-04-14`, licence Apache 2.0.
Modèle d'origine : https://huggingface.co/shaojieli/icefall-asr-commonvoice-fr-pruned-transducer-stateless7-streaming-2023-04-02

L'encodeur (127 Mo) est coupé en deux morceaux (`encodeur.int8.onnx.0` et `.1`)
parce que GitHub refuse les fichiers de plus de 100 Mo ; `api/tripo_oreille.py`
les recolle dans /tmp au premier appel.
