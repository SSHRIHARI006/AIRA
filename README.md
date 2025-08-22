# AIRA - Advanced Information Retrieval and Assistant

AIRA is a comprehensive Retrieval-Augmented Generation (RAG) system designed to provide accurate and context-aware responses based on a knowledge base. The system combines vector embeddings with powerful language models to deliver precise information retrieval and natural language understanding.

## Project Overview

AIRA consists of a full-stack application with:

1. **Backend**: FastAPI-powered REST API with Pinecone vector database integration
2. **Frontend**: React application with a modern UI built using TypeScript, Vite, and TailwindCSS
3. **RAG Pipeline**: A sophisticated retrieval and generation pipeline using LangChain and vector embeddings

The system is designed to be modular, scalable, and maintainable. It leverages modern software development practices and tools to deliver a high-quality user experience.

## Architecture

### Backend Components

- **FastAPI Application**: Provides REST API endpoints for querying the system
- **Retrieval Pipeline**: Combines semantic search and generative AI capabilities
- **Vector Database**: Uses Pinecone for efficient vector similarity search
- **Embedding Generation**: Utilizes Jina Embeddings for high-quality document and query embeddings
- **Caching Layer**: Implements semantic caching for improved performance

### Frontend Components

- **React/TypeScript**: Modern frontend framework for building responsive UIs
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Next-generation frontend build tool for fast development experience

### Data Flow

1. User submits a query through the frontend interface
2. Backend processes the query and generates an embedding
3. The embedding is used to search the vector database for relevant documents
4. Retrieved documents and the query are passed to the language model
5. The language model generates a comprehensive response
6. Response is returned to the frontend and displayed to the user

## Technical Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Pinecone account
- Access to LLM API (e.g., Groq, OpenAI)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Keys
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
JINA_API_KEY=your_jina_api_key
GROQ_API_KEY=your_groq_api_key

# Configuration
PORT=8000
```

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn backend.app:app --host 127.0.0.1 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Data Preparation

The system uses JSON data stored in the `json_data` directory:
- `parent.json`: Contains parent documents
- `child.json`: Contains chunked text from parent documents

To ingest your own data:
1. Format your data according to the schema in the existing files
2. Run the embedding script to populate the vector database:
   ```bash
   python -m backend.embedding_pinecone
   ```

## Implementation Details

### Vector Database Integration

The system uses Pinecone for vector storage and retrieval, chosen for its:
- Scalability and performance
- Serverless deployment options
- Rich metadata filtering capabilities
- Real-time updates

### Embedding Generation

Jina AI's embeddings are used for converting text into vector representations:
- High-dimensional embeddings (1024)
- Strong semantic understanding
- Good performance on retrieval tasks

### RAG Pipeline

The RAG pipeline is implemented using LangChain:
- Step 1: Query embedding generation
- Step 2: Vector similarity search
- Step 3: Document retrieval with metadata
- Step 4: Context augmentation and prompt construction
- Step 5: Response generation using LLM

### Semantic Caching

A custom semantic cache is implemented to:
- Reduce latency for similar queries
- Lower API costs
- Improve overall system performance

### Error Handling and Resilience

The system implements:
- Graceful error handling
- Automatic retries for API failures
- Comprehensive logging
- API key rotation for high availability

## Deployment

The project includes configuration files for deployment options:

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t aira-app .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env aira-app
   ```

### Railway Deployment

The project includes a `railway.toml` file for deploying to Railway.app.

## Development Workflow

1. **Environment Setup**: Configure your development environment with the required API keys
2. **Backend Development**: Enhance the FastAPI application and RAG pipeline
3. **Frontend Development**: Modify the React components for improved user experience
4. **Testing**: Ensure proper functionality through manual and automated testing
5. **Deployment**: Deploy to your chosen environment using the included configuration files

## Future Improvements

- Implement multi-modal capabilities (image, audio)
- Enhance context handling for longer conversations
- Add user authentication and personalization
- Improve vector database management tools
- Implement automated testing framework
- Add support for custom knowledge bases

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Development Team: AIRAC
