import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route Chatbot
Route.post('/questions', 'ChatbotsController.sendQuestion')
Route.get('/conversation', 'ChatbotsController.index')
Route.get('/conversation/:id', 'ChatbotsController.show')
