# Complaint AI workflow

The Express API trains a TF-IDF multiclass logistic-regression classifier from
the labeled examples in `utils/complaintClassifier.js` when the backend starts.
It predicts the complaint category and priority. The API maps each predicted
category to its department, compares open complaints using text TF-IDF and
location similarity, and saves the results in PostgreSQL.

## Setup

From the repository root, install frontend and backend dependencies if needed:

```powershell
npm install
npm install --prefix backend
npm install --prefix frontend
```

Apply the additive PostgreSQL migration using the existing `backend/.env`
database settings:

```powershell
npm run migrate:complaint-ai --prefix backend
```

Start the existing backend and frontend in separate terminals:

```powershell
npm start --prefix backend
npm start --prefix frontend
```

## Verify

```powershell
npm test --prefix backend
npm run build --prefix frontend
```

The classifier uses a small, explicitly labeled starter corpus. For production
accuracy, add reviewed, representative, multilingual complaint examples to
`CATEGORY_EXAMPLES` and `PRIORITY_EXAMPLES`, then run the tests again. Priority
and category confidence values are model estimates, not guarantees.

## Database changes

The migration adds nullable priority, model confidence, and duplicate-group
columns; a priority check; a self-reference from duplicate groups to complaints;
indexes for the officer queue; and a backfill of missing departments based on
existing categories. It does not remove or rename existing columns or complaint
records. Old null priorities display and sort as Low.
