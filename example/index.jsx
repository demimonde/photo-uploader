import core from '@idio/core'
import render from '@depack/render'

(async () => {
  const { url } = await core({
    frontend: { directory: ['example', 'src'] },
    async api(ctx, next) {
      if (ctx.path.startsWith('/form')) {
        ctx.body = { error: null, photoId: Math.random() }
      } else await next()
    },
    serve(ctx) {
      ctx.body = render(<html>
        <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossOrigin="anonymous"/>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

          <title>Photo Uploader Example</title>
          <style>
            {`body {
              background: #dfffdf;
            }`}
          </style>
        </head>
        <body id="preact">
          <script type="module" src="/example/App.jsx"/>
        </body>
      </html>, { addDoctype: true })
    },
  }, { port: 3000 })
  console.log('%s', url)
})()