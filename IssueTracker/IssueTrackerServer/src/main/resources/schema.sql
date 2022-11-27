create table items(
    id bigint not null,
    item_name varchar(100),
    estimated_effort int not null,
    logged_effort int,
    assigned_to varchar(100)
);