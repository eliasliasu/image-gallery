import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client

gallery = mongo_client.gallery
images_collection = gallery.images

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
UNSPLASH_URL = "https://api.unsplash.com/photos/random"
DEBUDG = bool(os.environ.get("DEBUG", True))


if not UNSPLASH_KEY:
    raise EnvironmentError("Please set your UNSPLASH_KEY in .env.local")

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = DEBUDG


@app.route("/new-image")
def new_image():
    word = request.args.get("query")
    headers = {"Accept-Version": "v1", "Authorization": "Client-ID " + UNSPLASH_KEY}
    params = {"query": word}
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)

    data = response.json()
    return data


@app.route("/images", methods=["GET","POST"])
def images():
    """
    Get images from the database
    Save image in the database
    NOTE: Unsplash policy restricts saving images to the server
    """
    if request.method == "GET":
        #read images from the database
        images = images_collection.find({})
        # the return statement can be use as well
        # return jsonify([img for img in images])

        return jsonify(list(images))        
    elif request.method == "POST":
        # save image in the database
        image = request.get_json()
        image["_id"] = image.get("id")
        result = images_collection.insert_one(image)
        inserted_id = result.inserted_id

        return {"inserted_id": inserted_id}
    
@app.route("/images/<image_id>", methods=["DELETE"])
def delete(image_id):    
    try:
        if request.method == "DELETE":
        # delete image from the database
            result = images_collection.delete_one({"_id": image_id})
            if not result or result.deleted_count == 0:
                return {"message": "Image was not deleted. Please try again"}, 500
            if result and not result.deleted_count:
                return {"message": "Image not found"}, 404
            return {"deleted_id": image_id} 
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
