# Kafka Soccer Analyzer App

A modern, fast, local Vue 3 + TypeScript application designed to ingest and validate large Kafka CSV dumps for soccer fixtures. The interface natively parses datasets in-browser to identify missing data coverage and highlight data integrity anomalies, specifically focusing on lineup data metrics.

## Features & Tech Stack

- **Vue 3 Composition API**: Structured gracefully using discrete smart Composables (`useCsvProcessor`, `useTableSort`) and specific pure-UI functional child components.
- **Vite & TypeScript**: Super-fast HMR server layout powered by robust interface boundaries.
- **Client-Side Parsing**: Relies on `PapaParse` to parse large `.csv` datasets safely without needing a server component footprint.
- **Data Visualization**: Implements rich interactive visual tracking via `vue-chartjs`.

---

## Business Logic & Analysis Documentation

A central capability of this application is its flexible metric rules engine which evaluates dataset rows on the fly based on user configurations. Below are the internal evaluation decisions and algorithms.

### 1. Match Target Filtering
Before performing any metric operations, the system truncates the entire parsed CSV set by evaluating the column `League.Id`. 
- **Only matches that appear in the explicitly configured Target League IDs array (in the settings modal) are categorized as "Matched IDs"**. 
- Any row with a League ID absent from this whitelist is immediately discarded from the deep analysis metric pooling (categorized as "Other IDs").

### 2. Analysis Rule Engine
By default, the application checks specific columns (e.g., `last_playing_home` and `last_playing_away`). 
For any row that passed the League Filter, the dataset values are parsed back into integers and passed across the comparison operators defined in settings (like `< 11`).

### 3. Logic Matrix (AND / OR)
Users can change the fundamental strictness of rule validation:
- **OR**: If *ANY* of the analyzed columns flag below the threshold rules, the entire fixture row is flagged as **FAILED**.
- **AND**: *ALL* analyzed columns must simultaneously fail their respective metric checks for the fixture to be flagged as **FAILED**. 

*Any row that does not meet the specified failure criteria effectively returns `PASSED` statuses and implies healthy lineup mappings.*

### 4. Issue Segregation (Missing vs. Partial)
When a fixture receives a **FAILED** flag, it undergoes a secondary internal review to categorize the failure severity visually for quick resolution.

- **Missing Lineups (0)**: Designated when the fixture was flagged AND *any* evaluated metric equaled an exact value of `0`. This implies the system found practically no data mapped.
- **Partial Lineups (>0)**: Designated when the fixture fell below the desired criteria limit (e.g. value was `7` when needing `< 11`), but **NOT** `0`. This implies some data trickled into Kafka, but the lineup representation is potentially incomplete.

### 5. Visual Hierarchy Elements
All tables and statistics cards calculate variables based on matching counts.
Percentages represent specific portions of the pipeline logically:
- **Coverage Percentages**: Total Whitelisted Matches `(Matched IDs)` / All Possible System Rows. 
- **Issue Ratios**: Number of Failed Rows / Total Whitelisted Matches. 

## Development Setup

```bash
# Standard dependency installations
npm install

# Run the lightning-fast dev instance locally 
npm run dev

# Build the project
npm run build
```
