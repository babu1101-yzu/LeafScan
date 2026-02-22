# 🌿 LeafScan — AI-Powered Plant Disease Detection

A full-stack agricultural intelligence platform with **React.js frontend** and **Python FastAPI backend**, featuring AI disease detection, smart chatbot, community platform, weather alerts, and cultivation tips.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**

---

## 🐍 Backend Setup (Python / FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies (lightweight version without torch/ultralytics)
pip install fastapi uvicorn sqlalchemy python-jose passlib python-multipart pillow httpx pydantic[email] aiofiles python-dotenv

# 5. Run the backend server
python main.py
```

The API will be available at: **http://localhost:8000**
API Documentation: **http://localhost:8000/api/docs**

---

## ⚛️ Frontend Setup (React / Vite)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 🌤️ Weather API (Optional)

To enable real weather data, get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `backend/.env`:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

Without an API key, the app uses realistic mock weather data.

---

## 🤖 YOLOv5 Disease Detection

The app currently uses **mock predictions** for demonstration. To enable real YOLOv5 inference:

1. Install PyTorch and Ultralytics:
```bash
pip install torch torchvision ultralytics
```

2. Place your trained model at `backend/models/best.pt`

3. Update `backend/routes/diagnosis.py` — replace `mock_yolo_predict()` with:
```python
from ultralytics import YOLO
model = YOLO("models/best.pt")

def real_yolo_predict(image_path: str):
    results = model(image_path)
    top = results[0].probs.top1
    confidence = float(results[0].probs.top1conf)
    class_name = results[0].names[top]
    return class_name, confidence
```

---

## 📁 Project Structure

```
LeafScan/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # App entry point
│   ├── database.py             # SQLAlchemy setup
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # JWT authentication
│   ├── .env                    # Environment variables
│   ├── requirements.txt        # Python dependencies
│   └── routes/
│       ├── auth.py             # Login/Register endpoints
│       ├── diagnosis.py        # Disease detection
│       ├── chatbot.py          # AI chatbot
│       ├── community.py        # Posts & comments
│       ├── weather.py          # Weather forecasts
│       ├── history.py          # Search history
│       └── tips.py             # Cultivation tips
│
├── frontend/                   # React.js frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx             # Router setup
│       ├── main.jsx            # Entry point
│       ├── index.css           # Global styles
│       ├── context/
│       │   └── AuthContext.jsx # Auth state management
│       ├── components/
│       │   ├── AppLayout.jsx   # Main layout with sidebar
│       │   ├── Sidebar.jsx     # Navigation sidebar
│       │   ├── AnimatedBackground.jsx
│       │   └── LoadingSpinner.jsx
│       └── pages/
│           ├── Landing.jsx     # Public landing page
│           ├── Login.jsx       # Authentication
│           ├── Register.jsx    # Registration
│           ├── Dashboard.jsx   # Main dashboard
│           ├── Diagnosis.jsx   # Disease detection
│           ├── Chatbot.jsx     # AI chatbot
│           ├── Community.jsx   # Social platform
│           ├── CultivationTips.jsx
│           ├── Weather.jsx     # Weather center
│           ├── History.jsx     # Search history
│           └── Profile.jsx     # User profile
│
└── README.md
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔬 **Disease Diagnosis** | Upload leaf photos for AI-powered disease detection (38+ diseases, 15+ crops) |
| 🤖 **AI Chatbot** | LeafBot — intelligent agricultural assistant with crop knowledge base |
| 👥 **Community** | Post, comment, like, and share farming experiences |
| 🌱 **Cultivation Tips** | Expert growing guides for 8+ crops with accordion details |
| 🌤️ **Weather Center** | Real-time forecasts with agricultural alerts (frost, drought, disease risk) |
| 📋 **History Log** | Timeline of all past diagnoses and searches |
| 👤 **Profile** | User management with preferences and avatar customization |
| 🔐 **Authentication** | Secure JWT-based login and registration |

---

## 🎨 Design System

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS with custom neon theme
- **Animations:** Framer Motion
- **Color Palette:** Dark green (#050D0A) + Neon green (#00FF87) + Cyan (#00D4FF)
- **Typography:** Orbitron (headings) + Inter (body) + Rajdhani (UI)
- **Charts:** Recharts

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/diagnosis/predict` | Upload image for diagnosis |
| GET | `/api/diagnosis/history` | Get diagnosis history |
| POST | `/api/chatbot/message` | Send message to LeafBot |
| GET | `/api/community/posts` | Get community posts |
| POST | `/api/community/posts` | Create new post |
| GET | `/api/weather/current` | Get weather data |
| GET | `/api/history/` | Get search history |
| GET | `/api/tips/` | Get cultivation tips |

Full API docs: **http://localhost:8000/api/docs**
