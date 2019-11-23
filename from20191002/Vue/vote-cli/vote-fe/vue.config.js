
module.exports = {
      chainWebpack: config => {
            config.externals({
                  'axios': 'axios',
                  'moment': 'moment'
            })
      },
}