```jsx
import { Avatar } from "components/ui";

const users = [
  {
    id: "uid1",
    name: "Leanne Graham",
    avatar_url: "/images/avatar/avatar-5.jpg",
  },
  {
    id: "uid2",
    name: "Ervin Howell",
    avatar_url: null,
  },
  {
    id: "uid3",
    name: "Clementine Bauch",
    avatar_url: "/images/avatar/avatar-12.jpg",
  },
  {
    id: "uid4",
    name: "John Lebsack",
    avatar_url: null,
  },
  {
    id: "uid5",
    name: "Mion Doe",
    avatar_url: null,
  },
  {
    id: "uid6",
    name: "Majid Yayoo",
    avatar_url: "/images/avatar/avatar-20.jpg",
  },
];

const AutoColor = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {users.map((user) => (
        <Avatar
          key={user.id}
          name={user.name}
          src={user.avatar_url}
          initialColor="auto"
        />
      ))}
    </div>
  );
};

export { AutoColor };
```