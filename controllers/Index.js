define(['altair/facades/declare',
        'altair/Lifecycle',
        'altair/events/Emitter',
        'altair/plugins/node!nodemailer'
], function (declare, Lifecycle, Emitter, nodemailer) {

    return declare([Lifecycle, Emitter], {

        /**
         * Just like any other AMD module in Altair, since we mixin the Lifecycle object, we can be certain that our
         * startup(options) method will be invoked (on all controllers) before anything else.
         *
         * @param options
         * @returns {altair.Promise}
         */
        startup: function (options) {

            //all events pertaining to a request are passed through titan:Alfred. See titan:Alfred/package.json for
            //a description of all events available.
            this.on('titan:Alfred::did-receive-request', {
                'controller': this
            }).then(this.hitch('onDidReceiveRequest'));

            //setup email
            this.mailer = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'taylor@spruce.me',
                    pass: 'L6340Fire'
                }
            });

            //pass call to parent
            return this.inherited(arguments);

        },

        /**
         * This is invoked whenever the did-receive-request event is emitted from Alfred. Alfred uses the concept of a
         * "theme" to represent the layout (views are dropped into layouts) of the current page. You can pass variables
         * through the theme to make them available in the layout. A theme is also responsible for handling all js/css
         * that will be included. See titan:Alfred/theme/Theme for more details.
         *
         * @param {altair.events.Event} e
         */
        onDidReceiveRequest: function (e) {

            //i'm getting the theme for the request
            var theme = e.get('theme');

            if (theme) {
                theme.set('errors', false)
                     .set('messages', false);
            }

        },

        /**
         * We've configured out ./configs/alfred.json to direct any request for '/' to index. From here, I'm doing a lazy
         * check if someone has POSTed a username and password and if they match, I'm redirecting them to /admin/dashboard.
         *
         * @param {altair.events.Event} e
         * @returns {altair.Promise}
         */
        index: function (e) {

            //by default, the current view is ./views/index.ejs - it will be set into the theme's context as `body`
            return e.get('view').render();
        },

        submitSongSuggestion: function (e) {

            var request = e.get('request'),
                post    = request.post(),
                name    = post.name,
                sug     = post.suggestions;

            this.mailer.sendMail({
                from: 'Wedding Website <no-reply@spruce.me>',
                to: 'beccamiller22@gmail.com, me@taylorrome.ro',
                subject: 'Song Suggestion From ' + name,
                text: 'Suggestions: ' + sug
            }, function () {

                console.log('email sent');

            });

            return { success: true };

        }


    });

});