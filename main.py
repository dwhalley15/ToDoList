from flask import Flask, render_template, jsonify, request

import json, os

app = Flask(__name__)

#Function to display the main HTML page.

@app.route('/')
def index():
  return render_template('index.html')

#Function to which reads and returns data from the JSON file.

@app.route('/api/todo', methods=['GET'])
def get_todo_list():
  route = os.path.realpath(os.path.dirname(__file__))
  json_list = os.path.join(route, "data", "list.json")
  with open(json_list, 'r') as read_list:
    json_object = json.load(read_list)
  return json_object

#Function which receives data from the client and uses it to overwrite the JSON file.

@app.route('/api/todo', methods=['PUT'])
def put_todo_list():
  message_ok = jsonify(message="List updated!")
  message_fail = jsonify(message="Failed to update list!")
  if request.is_json:
    data = request.get_json()
    route = os.path.realpath(os.path.dirname(__file__))
    json_list = os.path.join(route, "data", "list.json")
    with open(json_list, 'w') as write_list:
      json.dump(data, write_list)
    return message_ok, 200
  else:
    return message_fail, 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)