package com.example.codewise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CodewiseApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodewiseApplication.class, args);
	}

}
