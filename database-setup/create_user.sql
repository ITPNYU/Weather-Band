CREATE USER 'main'@'localhost' IDENTIFIED BY 'PASSWORD_HERE';
GRANT ALL PRIVILEGES ON main.* TO 'main'@'localhost' WITH GRANT OPTION;
flush privileges;