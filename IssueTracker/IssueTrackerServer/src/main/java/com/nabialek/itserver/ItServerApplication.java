package com.nabialek.itserver;

import com.nabialek.itserver.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ItServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ItServerApplication.class, args);
    }
    @Bean
    RestTemplate restTemplate() { return new RestTemplate();}
}
