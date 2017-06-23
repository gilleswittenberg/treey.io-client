let host
switch (process.env.NODE_ENV) {
case 'production':
  host = 'http://api.treey.io:8081'
  break
case 'test':
  host = 'http://test.api.treey.io'
  break
case 'development':
default:
  host = `http://${ window.location.hostname }:8081`
}

export default host
