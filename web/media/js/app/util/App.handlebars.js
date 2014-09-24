/**
 * Handlebars Helpers
 *
 * @module     App.handlebars
 * @author     Ushahidi Team <team@ushahidi.com>
 * @copyright  2013 Ushahidi
 * @license    https://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License Version 3 (AGPL3)
 */

define(['handlebars', 'underscore', 'moment', 'i18next', 'modules/config', 'underscore.string', 'handlebars-paginate', 'hbs!templates/partials/pagination', 'hbs!templates/partials/list-info', 'hbs!templates/partials/tag-with-icon'],
	function(Handlebars, _, moment, i18n, config, _str, paginate, paginationTpl, listInfoTpl, tagWithIconTpl)
	{
		Handlebars.registerHelper('url', function(options)
		{
			var url,
				App = require ('App'),
				baseurl = config.get('basepath');

			// Has this helper been used directly or as a block helper?
			if (typeof options === 'string')
			{
				url = options;
			}
			else
			{
				url = options.fn(this);
			}

			// If pushstate is disabled, add #! to urls
			if (! App.feature('pushstate'))
			{
				baseurl += '#';
			}

			return baseurl + url;
		});

		Handlebars.registerHelper('imageurl', function(url)
		{
			return config.get('imagedir') + url;
		});

		Handlebars.registerHelper('datetime-fromNow', function(timestamp)
		{
			return moment(timestamp).fromNow();
		});

		Handlebars.registerHelper('datetime-calendar', function(timestamp)
		{
			return moment(timestamp).calendar();
		});

		Handlebars.registerHelper('datetime', function(timestamp)
		{
			return moment(timestamp).format('LLL');
		});

		Handlebars.registerHelper('prune', function(text, length)
		{
			return _str.prune(text, length);
		});

		Handlebars.registerHelper('paginate', paginate);

		/**
		 * Based on newLineToBR here: https://github.com/elving/swag/blob/master/lib/swag.js
		 **/
		Handlebars.registerHelper('newLineToBr', function(options)
		{
			var str;

			// Has this helper been used directly or as a block helper?
			if (typeof options === 'string')
			{
				str = Handlebars.Utils.escapeExpression(options);
			}
			else
			{
				str = options.fn(this);
			}

			return new Handlebars.SafeString(str.replace(/\r?\n|\r/g, '<br>'));
		});

		Handlebars.registerHelper('feature', function (feature, options)
		{
			var App = require ('App');
			return App.feature(feature) ? options.fn(this) : '';
		});

		/**
		 * Return an <option> tag with value, label and selected attribute
		 */
		Handlebars.registerHelper('option', function(value, label, selectedValue) {
			var selectedProperty;
			if (_.isArray(selectedValue))
			{
				selectedProperty = (_.indexOf(selectedValue, value) >= 0) ? 'selected="selected"' : '';
			}
			else
			{
				selectedProperty = (value === selectedValue) ? 'selected="selected"' : '';
			}

			return new Handlebars.SafeString(
				'<option value="' + Handlebars.Utils.escapeExpression(value) + '"' + selectedProperty + '>' +
				Handlebars.Utils.escapeExpression(label) +
				'</option>'
			);
		});

		Handlebars.registerHelper('t', function(i18n_key, options) {
			var opts = i18n.functions.extend(options.hash, this),
				result = i18n.t(i18n_key, opts);

			return new Handlebars.SafeString(result);
		});
		Handlebars.registerHelper('tr', function(i18n_key, options) {
			var opts = i18n.functions.extend(options.hash, this),
				result;

			if (options.fn)
			{
				opts.defaultValue = options.fn(this);
			}

			result = i18n.t(i18n_key, opts);

			return new Handlebars.SafeString(result);
		});

		Handlebars.registerHelper('is', function(value_1, value_2, options)
		{
			if (arguments.length !== 3) {
				throw new Error('Handlebars Helper `is` requires exactly two parameters');
			}
			return (value_1 === value_2 ? options.fn(this) : options.inverse(this));
		});

		Handlebars.registerHelper('log', function(/* args */) {
			var args = Array.prototype.slice.call(arguments);
			return ddt.log.apply(null, ['Handlebars'].concat(args));
		});

		Handlebars.registerHelper('contains', function(list, value, options)
		{
			if (arguments.length !== 3) {
				throw new Error('Handlebars Helper `contains` requires exactly two parameters');
			}

			if (typeof list !== 'object')
			{
				throw new Error('Handlebars Helper `contains` requires parameter one to be an object');
			}

			return (_.contains(list, value) ? options.fn(this) : options.inverse(this));
		});

		Handlebars.registerPartial('pagination', paginationTpl);
		Handlebars.registerPartial('listinfo', listInfoTpl);
		Handlebars.registerPartial('tag-with-icon', tagWithIconTpl);

		return Handlebars;
	});
