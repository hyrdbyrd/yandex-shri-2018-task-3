# yandex-shri-task-3
## Для работы тестов понадобиться ввести
```bash
npm i
npm test
```
В самой функции обработчике ничего не использовалось, только чистый js. Постарался всё закомментировать там.
## Сама функция
- app.js
```js
module.exports.manager = input => {
...
```
## Тесты
- app.test.js
```js
...
describe('Scheduler', () => {
	it('should return a schedule, whose will meet the requirements', () => {
...
```