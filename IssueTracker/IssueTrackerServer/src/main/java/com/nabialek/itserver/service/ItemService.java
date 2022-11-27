package com.nabialek.itserver.service;

import com.nabialek.itserver.model.Item;
import com.nabialek.itserver.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(@Autowired ItemRepository itemRepository) {this.itemRepository = itemRepository;}
    public List<Item> listAllItems() {
        return itemRepository.findAll();
    }

    public Item findItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public void addItem(Item item) {
        itemRepository.save(item);
    }

    public void deleteItemById(Long id) {
        itemRepository.deleteById(id);
    }

    public void deleteAllItems() {
        itemRepository.deleteAll();
    }
}
