package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import io.swagger.v3.oas.annotations.media.Schema;

//za sestavine pri receptu
//dodatek k receptu
//embedded v recept

@Embeddable
public class Sestavina {

    @Column(name = "naziv")
    @Schema(description = "Ime sestavine", example = "Krompir")
    private String naziv;

    @Column(name = "kolicina")
    @Schema(description = "Količina sestavine", example = "300 g")
    private String kolicina;

    public Sestavina() {
    }

    public Sestavina(String naziv, String kolicina) {
        this.naziv = naziv;
        this.kolicina = kolicina;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getKolicina() {
        return kolicina;
    }

    public void setKolicina(String kolicina) {
        this.kolicina = kolicina;
    }
}
