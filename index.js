'use strict';

const url = require('url');
const _ = require('lodash');

const buildUrlFromRequest = (req) => {
	return url.format({
		protocol: 'https',
		host: req.get('x-forwarded-host'),
		pathname: req.originalUrl
	});
};

const buildUrl = (urlStr, qsObject) => {

	if ( !qsObject || !Object.keys(qsObject).length ) {
		return urlStr;
	}

	return url.format(_.extend(url.parse(urlStr), {query: qsObject}));
};

const avAuth = (opts) => {

	if ( !opts['checkHeader'] ) {
		throw new Error('Name of the header to check is required');
	}
	if ( !opts['barrierView'] ) {
		throw new Error('Name of the barrier view is required');
	}

	let viewModel = opts['viewModel'] || {};
	let checkHeader = opts['checkHeader'];
	let loginPage = opts['loginPage'] || 'https://accounts.ft.com/login';
	let registerPage = opts['registerPage'] || 'https://register.ft.com/';
	let subscriptionsPage = opts['subscriptionsPage'] || 'https://subscribe.ft.com/psp?segId=70703';

	return function(req, res, next) {
		console.log(checkHeader);
		if (!req.get(checkHeader)) {
			console.log(req.get(checkHeader));
			return next();
		}
		console.log('test');
		const location = buildUrlFromRequest(req);
		const barrierModel = {
			login: buildUrl(loginPage, {location}),
			register: buildUrl(registerPage, {location}),
			subscriptions: buildUrl(subscriptionsPage)
		};
		res.render(opts['barrierView'], _.extend(viewModel, barrierModel));
	}
};

module.exports = avAuth;
