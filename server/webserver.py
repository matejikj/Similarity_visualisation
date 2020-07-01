from flask import Flask, jsonify, request
from dataclasses import dataclass
import json
import os
import yaml
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@dataclass
class DatasetsObject:
    left: object
    right: object
    labels: object
    defaultPath: object
    rulePath: object
    directedPath: object
    finalPath: object

def _load_datasets_object_from_json(left, right) -> DatasetsObject:
    leftDataset = _load_file(left)
    rightDataset = _load_file(right)
    labels = _load_file("labels-" + left + "-" + right)
    defaultPath = _load_file("paths-" + left + "-" + right + "-default")
    finalPath = _load_file("paths-" + left + "-" + right + "-final")
    directedPath = _load_file("paths-" + left + "-" + right + "-directed")
    rulePath = _load_file("paths-" + left + "-" + right + "-rule")
    return DatasetsObject(leftDataset, rightDataset, labels, defaultPath, rulePath, directedPath, finalPath)

def _load_file(name: str):
    file = "../data/" + name + ".json"
    with open(file, encoding="utf-8") as stream:
        content = json.load(stream)
    return content

@app.route('/datasets')
def myHandler():
    left = request.args.get('left', default = '', type = str)
    right = request.args.get('right', default = '', type = str)
    print(left)
    print(right)
    dataset = _load_datasets_object_from_json(left, right)
    return jsonify(dataset)

def load_configuration():
    with open(os.path.join("..", "config.yaml")) as file:
        return yaml.load(file, Loader=yaml.FullLoader)["configuration"]

if __name__ == '__main__':
    app.run(port=8081)