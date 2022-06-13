export const highligntBackcolor = ['rgb(205,92,92)', 'rgb(0,128,0)', 'rgb(230,230,250)'];

export const ElementsKeyList = [
  ['Aircraft', 'Animals', 'Vehicles', 'Guns'],
  ['Props'],
  ['Songs', 'Effects', 'Wardrobe'],
];

export const ElementsOptions = [
  'AIRCRAFT',
  'ANIMALS',
  'VEHICLES',
  'GUNS',
  'PROPS',
  'SONGS',
  'EFFECTS',
  'WARDROBE',
];

export const ApiUrls = {
  dev: {
    getObjects: 'https://vc-script-analysis-engine-dev.apsgate.com/analysis/objects',
    getActions: 'https://vc-script-analysis-engine-dev.apsgate.com/analysis/actions',
    getDictionaryList: 'https://vc-script-analysis-engine-dev.apsgate.com/dictionary/post',
    addWordDictionary: 'https://vc-script-analysis-engine-dev.apsgate.com/dictionary/add',
    omitWordDictionay: 'https://vc-script-analysis-engine-dev.apsgate.com/dictionary/omit',
    extractTextPdf: 'https://vc-script-analysis-engine-dev.apsgate.com/extract/pdf',
  },
  stg: {
    getObjects: 'https://vc-script-analysis-engine-stg.apsgate.com/analysis/objects',
    getActions: 'https://vc-script-analysis-engine-stg.apsgate.com/analysis/actions',
    getDictionaryList: 'https://vc-script-analysis-engine-stg.apsgate.com/dictionary/post',
    addWordDictionary: 'https://vc-script-analysis-engine-stg.apsgate.com/dictionary/add',
    omitWordDictionay: 'https://vc-script-analysis-engine-stg.apsgate.com/dictionary/omit',
    extractTextPdf: 'https://vc-script-analysis-engine-stg.apsgate.com/extract/pdf',
  },
  release: {
    getObjects: 'https://vc-script-analysis-engine.apsgate.com/analysis/objects',
    getActions: 'https://vc-script-analysis-engine.apsgate.com/analysis/actions',
    getDictionaryList: 'https://vc-script-analysis-engine.apsgate.com/dictionary/post',
    addWordDictionary: 'https://vc-script-analysis-engine.apsgate.com/dictionary/add',
    omitWordDictionay: 'https://vc-script-analysis-engine.apsgate.com/dictionary/omit',
    extractTextPdf: 'https://vc-script-analysis-engine.apsgate.com/extract/pdf',
  },
};

export const ErrorMessage = { fetchError: 'The server is currently unavailable' };

export const Authorization =
  'Bearer: JnYhWG1QKVhTczRnRi9BX1BiY3VURXEuOE15MiF2WXJRNWhGQTV6V3ZLaEhwSmlYY25tTk1Dc1Mq';
