package com.nabialek.itserver.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemWithoutId {
    @JsonProperty("assignedColumn")
    private String assignedColumn;
    @JsonProperty("itemName")
    private String itemName;
    @JsonProperty("estimatedEffort")
    private Integer estimatedEffort;
    @JsonProperty("loggedEffort")
    private Integer loggedEffort;
    @JsonProperty("assignedTo")
    private String assignedTo;
}
