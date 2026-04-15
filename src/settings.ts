export interface AnalysisField {
  columnHeader: string;
  operator: '<' | '>' | '==';
  value: number;
}

export type LogicOperator = 'AND' | 'OR';

export interface AppSettings {
  leagueIds: number[];
  analysisFields: AnalysisField[];
  logicOperator: LogicOperator;
}

export const DEFAULT_SETTINGS: AppSettings = {
  leagueIds: [8, 8391, 1569, 60, 58, 68, 26401, 70, 2923, 25860, 41558, 15, 22263, 38649],
  analysisFields: [
    { columnHeader: 'last_playing_home', operator: '<', value: 11 },
    { columnHeader: 'last_playing_away', operator: '<', value: 11 }
  ],
  logicOperator: 'OR'
};
