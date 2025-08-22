from dotenv import load_dotenv
import os
import requests
import json
import logging
from langchain_core.documents import Document
import pinecone

class Cache:
    def __init__(self):
        load_dotenv()
        self.JINA_API_KEY = os.getenv("JINA_API_KEY")
        pinecone_api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = "semantic-cache-jina-api"
        self.dimension = 1024
        
        try:
            # Initialize Pinecone
            pinecone.init(api_key=pinecone_api_key)
            
            # Check if index exists, create if not
            indexes = pinecone.list_indexes()
            if self.index_name not in indexes:
                logging.info(f"Creating cache index '{self.index_name}'")
                pinecone.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric="cosine"
                )
            
            # Initialize the index
            self.index = pinecone.Index(self.index_name)
            logging.info(f"Successfully connected to cache index: {self.index_name}")
        except Exception as e:
            logging.error(f"Error connecting to Pinecone cache: {e}")
            # Mock index for now to avoid errors
            self.index = None

    def _get_jina_embedding(self, text: str) -> list[float]:
        url = "https://api.jina.ai/v1/embeddings"
        headers = {
            "Authorization": f"Bearer {self.JINA_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {"model": "jina-embeddings-v3", "input": text, "task": "retrieval.passage"}

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"Jina API Error in Cache: {response.text}")

        return response.json()["data"][0]["embedding"]

    def get(self, query: str, threshold=0.8):
        # Skip cache lookup for now
        return None

    def add(self, query: str, parent_text: str, parent_tables: list):
        # Skip caching for now
        pass
