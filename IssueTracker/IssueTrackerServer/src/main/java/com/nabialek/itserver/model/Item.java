package com.nabialek.itserver.model;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "items")
public class Item {
    @Id
    private Long id;
    @Column(name = "assigned_column")
    private String assignedColumn;
    @Column(name = "item_name")
    private String itemName;
    @Column(name = "estimated_effort")
    private Integer estimatedEffort;
    @Column(name = "logged_effort")
    private Integer loggedEffort;
    @Column(name = "assigned_to")
    private String assignedTo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Item item = (Item) o;
        return id != null && Objects.equals(id, item.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
