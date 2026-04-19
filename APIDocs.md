# API Docs

Base URL:

```text
http://localhost:3000
```

If frontend runs on another device, use your local network IP instead of `localhost`.

## Auth

### `POST /api/auth/login`

Что делает: авторизует пользователя по логину и паролю.
Что возвращает: JWT токен и краткую информацию о пользователе.

Request:

```json
{
  "username": "kristina",
  "password": "securepass"
}
```

Response:

```json
{
  "access_token": "jwt...",
  "user": {
    "id": 1,
    "username": "kristina",
    "firstName": "Kristina",
    "lastName": "Shark",
    "position": 12
  }
}
```

## Users

### `POST /api/users/register`

Что делает: регистрирует нового пользователя.
Что возвращает: пустой успешный ответ, если пользователь создан.

Request:

```json
{
  "firstName": "Ivan",
  "lastName": "Ivanov",
  "position": 1,
  "techStack": [1, 2, 6],
  "username": "ivan123",
  "password": "securepass"
}
```

Response:

```json
{}
```

### `GET /api/users`

Что делает: возвращает список всех пользователей.
Что возвращает: массив пользователей.

Response:

```json
[
  {
    "id": 1,
    "firstName": "Kristina",
    "lastName": "Shark",
    "position": 12,
    "techStack": [1, 2],
    "username": "kristina"
  }
]
```

### `GET /api/users/profile`

Что делает: возвращает профиль текущего авторизованного пользователя.
Что возвращает: данные текущего пользователя без пароля.

Headers:

```text
Authorization: Bearer <token>
```

Response:

```json
{
  "id": 1,
  "firstName": "Kristina",
  "lastName": "Shark",
  "position": 12,
  "techStack": [1, 2],
  "username": "kristina"
}
```

### `PATCH /api/users/profile`

Что делает: обновляет профиль текущего авторизованного пользователя.
Что возвращает: обновлённые данные пользователя без пароля.

Headers:

```text
Authorization: Bearer <token>
```

Request:

```json
{
  "firstName": "Kristina",
  "lastName": "Shark",
  "position": 4,
  "techStack": [1, 2, 6],
  "username": "kristina_new",
  "password": "newsecurepass"
}
```

Response:

```json
{
  "id": 1,
  "firstName": "Kristina",
  "lastName": "Shark",
  "position": 4,
  "techStack": [1, 2, 6],
  "username": "kristina_new"
}
```

## Positions

### `GET /api/positions`

Что делает: возвращает список всех доступных должностей.
Что возвращает: массив `position`, который можно использовать в выборе роли.

Response:

```json
[
  { "id": 1, "name": "Frontend Developer" },
  { "id": 2, "name": "Backend Developer" }
]
```

## Technologies

### `GET /api/technologies`

Что делает: возвращает список всех доступных технологий.
Что возвращает: массив `technology`, который можно использовать для выбора `techStack`.

Response:

```json
[
  { "id": 1, "name": "JavaScript" },
  { "id": 2, "name": "TypeScript" }
]
```

## Chat

All chat endpoints now require authorization.

Headers:

```text
Authorization: Bearer <token>
```

### `POST /api/chat/create`

Что делает: создаёт новый чат интервью для текущего пользователя.
Что возвращает: созданный чат.

Request:

```json
{
  "title": "Моё интервью"
}
```

Response:

```json
{
  "id": 1,
  "title": "Моё интервью",
  "created_at": 1710000000,
  "updated_at": 1710000000
}
```

### `GET /api/chat`

Что делает: возвращает все чаты текущего пользователя.
Что возвращает: массив чатов пользователя.

Response:

```json
[
  {
    "id": 1,
    "title": "Моё интервью",
    "created_at": 1710000000,
    "updated_at": 1710000000
  }
]
```

### `GET /api/chat/:id`

Что делает: возвращает один чат текущего пользователя по `id`.
Что возвращает: объект чата.

Response:

```json
{
  "id": 1,
  "title": "Моё интервью",
  "created_at": 1710000000,
  "updated_at": 1710000000
}
```

### `GET /api/chat/:id/history`

Что делает: возвращает всю историю сообщений внутри выбранного чата.
Что возвращает: массив сообщений чата в порядке создания.

Response:

```json
[
  {
    "id": 10,
    "role": "question",
    "text": "Tell me about yourself",
    "created_at": 1710000000
  }
]
```

### `GET /api/chat/:id/question`

Что делает: генерирует и сохраняет новый вопрос для выбранного чата.
Что возвращает: сообщение с ролью `question`.

Response:

```json
{
  "id": 11,
  "role": "question",
  "text": "Where do you see yourself in 5 years?",
  "created_at": 1710000000
}
```

### `POST /api/chat/:id/answer`

Что делает: сохраняет ответ пользователя, отправляет его на оценку и проверяет новые ачивки.
Что возвращает: результат оценки, id системного сообщения и список новых открытых ачивок.

Request:

```json
{
  "question": "Where do you see yourself in 5 years?",
  "user_answer": "I want to grow as a frontend developer..."
}
```

Response:

```json
{
  "model_answer": "...",
  "evaluation": {
    "...": "..."
  },
  "id": 12,
  "created_at": 1710000000,
  "unlockedAchievements": [
    {
      "id": 1,
      "achievementId": 2
    }
  ]
}
```

## Gamification

All gamification endpoints require authorization.

Headers:

```text
Authorization: Bearer <token>
```

### `GET /api/gamification/profile`

Что делает: возвращает игровую статистику текущего пользователя.
Что возвращает: streak, счётчики активности за сегодня и список уже полученных ачивок.

Response:

```json
{
  "stats": {
    "currentStreak": 3,
    "longestStreak": 5,
    "totalActiveDays": 7,
    "totalMessages": 26,
    "totalChats": 11,
    "lastActiveDate": "2026-04-19"
  },
  "today": {
    "date": "2026-04-19",
    "messagesCount": 4,
    "chatsCreated": 1
  },
  "achievements": [
    {
      "code": "streak_3",
      "title": "On Fire 3",
      "description": "Stay active 3 days in a row.",
      "unlockedAt": 1710000000,
      "isNew": true
    }
  ]
}
```

### `GET /api/gamification/achievements`

Что делает: возвращает полный список всех ачивок в системе.
Что возвращает: массив всех ачивок с признаком, открыты они у пользователя или нет.

Response:

```json
[
  {
    "code": "first_answer",
    "title": "First Step",
    "description": "Send your first answer in the interview simulator.",
    "unlocked": true,
    "unlockedAt": 1710000000,
    "isNew": true
  },
  {
    "code": "streak_3",
    "title": "On Fire 3",
    "description": "Stay active 3 days in a row.",
    "unlocked": false,
    "unlockedAt": null,
    "isNew": false
  }
]
```
