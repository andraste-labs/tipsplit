tipsplit/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BillInput.tsx
│   │   │   ├── TipPresetButtons.tsx
│   │   │   ├── CustomTipInput.tsx
│   │   │   ├── PeopleCounter.tsx
│   │   │   ├── ResultSummary.tsx
│   │   │   └── Header.tsx
│   │   ├── hooks/
│   │   │   ├── useTipCalculator.ts
│   │   │   └── useHistory.ts
│   │   ├── pages/
│   │   │   └── HomePage.tsx        # thin page, composes components
│   │   ├── api/
│   │   │   └── historyApi.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entrypoint
│   │   ├── routers/
│   │   │   └── history.py          # /history endpoints
│   │   ├── schemas/
│   │   │   └── history_schema.py
│   │   ├── crud/
│   │   │   └── history_crud.py
│   │   ├── models/
│   │   │   └── history_model.py
│   │   ├── database.py
│   │   └── config.py
│   ├── requirements.txt
│   └── alembic/                    # DB migrations
│
├── docker-compose.yml
└── README.md