module.exports = {
    mode: 'development',
    entry: './script.js',
    output: {
        filename: './main.js',
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          },
        ],
      },
 };
 