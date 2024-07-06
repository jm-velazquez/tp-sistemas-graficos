const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // Ensure this matches your dev server configuration
    },
    devServer: {
        open: true,
        host: 'localhost',
        static: {
            directory: path.join(__dirname, 'dist'), // Serve from 'dist' directory
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Ensure this matches your project structure
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'resources',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production'
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW())
    } else {
        config.mode = 'development'
    }
    return config
}
