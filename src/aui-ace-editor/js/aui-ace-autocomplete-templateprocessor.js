var Lang = A.Lang,
	AArray = A.Array,
	AObject = A.Object,
	Base = A.AceEditor.AutoCompleteBase,

	_DOT = '.',
	_STR_EMPTY = '',
	DIRECTIVES = 'directives',
	FILL_MODE = 'fillMode',
	HOST = 'host',
	METHOD = 'Method',
	VARIABLES = 'variables',

	MATCH_DIRECTIVES = 0,
	MATCH_VARIABLES = 1,

	TOKEN_PUNCTUATOR_DOT = 1,
	TOKEN_UNRECOGNIZED = -1,
	TOKEN_VARIABLE = 0,

	_NAME = 'aui-ace-autocomplete-templateprocessor',

TemplateProcessor = A.Base.create(_NAME, A.Base, [
], {
	getResults: function(match, callbackSuccess, callbackError) {
		var instance = this,
			content,
			host,
			matchDirectives,
			matches,
			type;

		type = match.type;

		if (type === MATCH_DIRECTIVES) {
			matchDirectives = instance.get(DIRECTIVES);

			content = match.content.toLowerCase();

			if (content.length) {
				host = instance.get(HOST);

				matchDirectives = host._filterResults(content, matchDirectives);
			}

			callbackSuccess(matchDirectives);
		}
		else if (type === MATCH_VARIABLES) {
			matches = instance._getVariableMatches(match.content);

			callbackSuccess(matches);
		}
	},

	getSuggestion: function(match, selectedSuggestion) {
		var instance = this,
			fillMode,
			lastEntry,
			result,
			type,
			variables;

		result = selectedSuggestion || _STR_EMPTY;

		if (selectedSuggestion) {
			fillMode = instance.get(HOST).get(FILL_MODE);

			type = match.type;

			if (fillMode === Base.FILL_MODE_INSERT) {
				if (type === MATCH_DIRECTIVES) {
					if (match.content && selectedSuggestion.indexOf(match.content) === 0) {
						result = selectedSuggestion.substring(match.content.length);
					}
				}
				else if (type === MATCH_VARIABLES) {
					variables = match.content.split(_DOT);

					lastEntry = variables[variables.length - 1];

					if (lastEntry && selectedSuggestion.indexOf(lastEntry) === 0) {
						result = selectedSuggestion.substring(lastEntry.length);
					}
				}
			}
			else if (type === MATCH_VARIABLES) {
				variables = match.content.split(_DOT);

				variables[variables.length - 1] = selectedSuggestion;

				result = variables.join(_DOT);
			}
		}

		return result;
	},

	_isLastToken: function(index, tokens) {
		return index === tokens.length - 1;
	},

	_getTokenType: function(token) {
		var tokenType = TOKEN_UNRECOGNIZED;

		if (Lang.isString(token)) {
			if (token.length) {
				tokenType = TOKEN_VARIABLE;
			}
			else {
				tokenType = TOKEN_PUNCTUATOR_DOT;
			}
		}

		return tokenType;
	},

	_getVariableMatches: function(content) {
		var instance = this,
			curVariableData,
			data,
			host,
			i,
			isLastToken,
			lastEntry,
			leftPartheseIndex,
			matches,
			results,
			resultsData,
			token,
			tokens,
			tokenType,
			variableData,
			variableType;

		results = [];

		data = instance.get(VARIABLES);

		resultsData = {};

		curVariableData = data.variables;

		if (content) {
			tokens = content.split(_DOT);

			lastEntry = tokens[tokens.length - 1];

			for (i = 0; i < tokens.length; i++) {
				token = tokens[i];

				tokenType = instance._getTokenType(token);

				if (tokenType === TOKEN_PUNCTUATOR_DOT) {
					if (i === 0) {
						curVariableData = {};
					}
					else {
						resultsData = curVariableData;
					}
				}
				else if (tokenType === TOKEN_VARIABLE) {
					isLastToken = instance._isLastToken(i, tokens);

					if (isLastToken) {
						resultsData = curVariableData;

						break;
					}

					leftPartheseIndex = token.indexOf('(');

					if (leftPartheseIndex !== -1) {
						token = token.substring(0, leftPartheseIndex);
					}

					variableData = curVariableData[token];

					if (variableData) {
						if (i === 0) {
							variableType = variableData.type;
						}
						else {
							variableType = variableData.returnType;
						}

						curVariableData = data.types[variableType] || {};
					}
					else if (isLastToken) {
						resultsData = curVariableData;

						break;
					}
					else {
						resultsData = {};

						break;
					}
				}
			}
		}
		else {
			resultsData = data.variables;
		}

		results = AObject.keys(resultsData);

		matches = results.sort();

		if (lastEntry) {
			host = instance.get(HOST);

			matches = host._filterResults(lastEntry, matches);
		}

		if (matches.length) {
			matches = AArray.map(
				matches,
				function(item, index) {
					var args,
						data;

					data = resultsData[item];

					if (data.type === METHOD) {
						args = AArray.map(
							data.argumentTypes,
							function(item, index) {
								var parts = item.split('.');

								return parts[parts.length - 1];
							}
						);

						return item + '(' + args.join(', ') + ')';
					}
					else {
						return item;
					}
				}
			);
		}

		return matches;
	},

	_setRegexValue: function(value) {
		var result = A.AttributeCore.INVALID_VALUE;

		if (Lang.isString(value)) {
			result = new RegExp(value);
		}
		else if (value instanceof RegExp) {
			result = value;
		}

		return result;
	}
}, {
	NAME: _NAME,

	NS: _NAME,

	ATTRS: {
		directives: {
			validator: Lang.isArray
		},

		host: {
			validator: Lang.isObject
		},

		variables: {
			validator: Lang.isObject
		}
	}
});

A.AceEditor.TemplateProcessor = TemplateProcessor;