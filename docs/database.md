## Database schema

### Table

Database schema consists of a single 'items' table storing generic items with open ended attributes. Items have a unique id and are organized hierarchically. Items have open ended json attributes which can be used in json queries with MySQL. Indexes help keep items of different types separate when it comes to performance of queries. This is essentially MySQL being used for the most part as a NoSQL database. The advantage is the quick startup and simplicity of code. Heavier item types with lots of entries can easily be moved to custom tables later if need be.

```sql
CREATE TABLE `items` (
  `id` varchar(64) NOT NULL,
  `parentId` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL,
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `attributes` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `items_id_index` (`id`),
  KEY `items_parentid_index` (`parentId`),
  KEY `items_type_index` (`type`),
  CONSTRAINT `items_parentid_foreign` FOREIGN KEY (`parentId`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


