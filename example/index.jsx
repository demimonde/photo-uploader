import core, { render } from '@idio/idio'
import classNames from './bootstrap'
import frontend from '@idio/frontend/src'

(async () => {
  const { url, server } = await core({
    // frontend: { use: true, directory: ['example', 'src'],
    //   jsxOptions: {
    //     prop2class: true,
    //     classNames, // bootstrap classnames
    //   },
    // },
    _frontend: {
      middlewareConstructor() {
        return frontend({
          directory: ['example', 'src'],
          hotReload: true,
          jsxOptions: {
            prop2class: true,
            classNames, // bootstrap classnames
          },
          getServer() { return server },
        })
      },
      use: true,
    },
    async api(ctx, next) {
      if (ctx.path.startsWith('/form')) {
        ctx.body = { error: null, photoId: Math.random() }
      } else await next()
    },
    serve(ctx) {
      ctx.body = render(<html>
        <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" />
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

          <title>Photo Uploader Example</title>
          <style>
            {`body {
              background: #dfffdf;
            }`}
          </style>
        </head>
        <body>
          <div id="preact-app" />
        </body>
        <script src="/hot-reload.js"/>
        <script type="module" src="/example/App.jsx"/>
      </html>, { addDoctype: true })
    },
  }, { port: 3000 })
  console.log('%s', url)
})()