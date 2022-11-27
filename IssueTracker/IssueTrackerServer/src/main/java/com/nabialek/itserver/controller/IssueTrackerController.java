package com.nabialek.itserver.controller;

import com.nabialek.itserver.model.Item;
import com.nabialek.itserver.model.ItemWithoutId;
import com.nabialek.itserver.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("items")
@CrossOrigin
public class IssueTrackerController {

    IssueTrackerController(@Autowired ItemService itemService) {
        this.itemService = itemService;
    }
    private final ItemService itemService;

    @GetMapping
    public List<Item> getItems() {
        return itemService.listAllItems();
    }

    @PostMapping("/{itemId}")
    public void saveItem(@PathVariable Long itemId, @RequestBody ItemWithoutId itemWithoutId) {
        final Item item = new Item(itemId,
                itemWithoutId.getAssignedColumn(),
                itemWithoutId.getItemName(),
                itemWithoutId.getEstimatedEffort(),
                itemWithoutId.getLoggedEffort(),
                itemWithoutId.getAssignedTo());
        itemService.addItem(item);
    }

    @GetMapping("/{itemId}")
    public Item getItemByItemId(@PathVariable Long itemId) {
        return itemService.findItemById(itemId);
    }

    @DeleteMapping
    public void deleteAllItems() {
        itemService.deleteAllItems();
    }

    @DeleteMapping("/{itemId}")
    public void deleteItem(@PathVariable Long itemId) {
        itemService.deleteItemById(itemId);
    }
}
