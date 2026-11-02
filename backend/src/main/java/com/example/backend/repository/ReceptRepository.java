package com.example.backend.repository;

import com.example.backend.model.Recept;
import org.springframework.data.jpa.repository.JpaRepository;

//za delovanje med aplikacijo in bazo (zaenkrat h2)

public interface ReceptRepository extends JpaRepository<Recept, Long> {
}

