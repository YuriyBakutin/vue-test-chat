# vue-test-chat

## Описание

Это проект, разработанный на основе тестового задания, в котором предлагалось создать SPA из двух роутов.

Первый роут - выбор URL картинки для аватарки и пользовательского имени. По завершении происходит переход по второму роуту.

Второй роут - макет чата с двумя окнами. Одно окно отражает чат от имени вошедшего, а второе - тот же чат со стороны уже имеющегося пользователя с именем Иван Иванович. Можно переписываться, как с партнёром, так и с самим собой.

Представленная здесь работа несколько расширяет задание. Связано это не столько с желанием показать свои умения, сколько со стремлением не получать проклятий со стороны предполагаемого пользователя:)

  - Выбор картинки без инструментов обрезки до нужного фрагмента сильно снижает пользовательские возможности. Я бы был сильно огорчён, если бы как пользователь столкнулся с таким ограничением.
  - Добавление обрезки породило проблемы, связанные с тем, что задание тестовое. Сервера нет. Всё локально. Картинка берётся из Интернета, а не подгружается из файловой системы. Изображение, полученное на Canvas с помощью картинки, подгруженной со стороннего ресурса, браузер не даёт упаковать в base64 по соображениям безопасности...
  - В учебном примере необходимо работать только с двумя контактами - с тем, под которым был вход и с контактом Ивана Ивановича. Если это макет чата, то вообще-то контактов может быть много. Для тестирования полосы прокрутки, их пришлось завести достаточное количество. Не удалять же после тестирования! Значит нужно обеспечить переключение между ними.
  - И т.д...

Таким образом получилось, что проект немного разросся.

Но теперь его элементы можно использовать как основу для разработки полноценного чата.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
