import Random from 'random-js';
import isFinite from 'lodash/isFinite';
import isObject from './isObject';
import { expressionEvaluators } from './expressions/standardExpressionEvaluators';
import { actionHandlers } from './actions';


const defaultContext = {
    firstSceneId: 'start',
    initialVars: {
        currentSceneId: {
            type: 'string',
            value: '',
            readOnly: true
        },
        previousSceneId: {
            type: 'string',
            value: '',
            readOnly: true
        }
    },
    scenes: {},
    blocks: {},
    reportError: _message => console.error(_message),
    _rng: Random.engines.mt19937().autoSeed(),
    expressionEvaluators: expressionEvaluators,
    actionHandlers: actionHandlers
};

export function buildContext(_context = {}) {
    // TODO: Figure out why the following is necessary.
    defaultContext.actionHandlers = actionHandlers;
    let newContext = Object.assign({}, defaultContext, _context);
    if (_context.hasOwnProperty('initialVars')) {
        newContext.initialVars = Object.assign({}, defaultContext.initialVars, _context.initialVars);
    }
    return newContext;
}

export function isValidContext(_context) {
    let errorMessages = [];

    if (isObject(_context)) {
        for (let propertyName in defaultContext) {
            if (!_context.hasOwnProperty(propertyName)) {
                errorMessages.push('Context is missing ' + propertyName + ' property.');
            }
        }
    } else {
        errorMessages.push('Context is not an object.');
    }

    return {
        isValid: errorMessages.length === 0,
        errorMessages: errorMessages
    };
}

export function getRandomInt(_context, _upper) {
    if (!isObject(_context)) {
        throw new Error('getRandomInt: _context parameter is not an object.');
    }
    if (!isFinite(_upper)) {
        throw new Error('getRandomInt: _upper parameter is not a number.');
    }
    return (_upper > 0) ? Random.integer(0, _upper - 1)(_context._rng) : 0;
}
