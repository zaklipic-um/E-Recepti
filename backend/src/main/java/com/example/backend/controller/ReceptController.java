package com.example.backend.controller;

import com.example.backend.model.Recept;
import com.example.backend.service.ReceptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Recepti", description = "Pregledovanje in upravljanje kuhinjskih receptov")
@RestController
@RequestMapping("/api/recepti")
public class ReceptController {

    private final ReceptService receptService;

    public ReceptController(ReceptService receptService) {
        this.receptService = receptService;
    }

    //OPERACIJE

    @Operation(summary = "Pridobi vse recepte", description = "Vrne vse shranjene recepte skupaj s sestavinami.")
    @ApiResponse(responseCode = "200", description = "Seznam receptov je uspešno vrnjen",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Recept.class))))
    @GetMapping
    //VAJA3 - API zdaj sprejema parametre za filtre in razvrscanje
    // Neobvezni parametri omogočajo kombinirano filtriranje že v zaledju.
    public List<Recept> getAllRecepti(
            @RequestParam(required = false) String kategorija,
            @RequestParam(required = false) Integer najvecjiCas,
            @RequestParam(required = false) String sestavina,
            @RequestParam(required = false) String razvrsti) {
        return receptService.getAllRecepti(kategorija, najvecjiCas, sestavina, razvrsti);
    }

    @Operation(summary = "Pridobi recept po ID-ju", description = "Vrne en recept z navedenim ID-jem.")
    @ApiResponse(responseCode = "200", description = "Recept je uspešno vrnjen",
            content = @Content(schema = @Schema(implementation = Recept.class)))
    @GetMapping("/{id}")
    public Recept getReceptById(@Parameter(description = "Enolični ID recepta", example = "1") @PathVariable Long id) {
        return receptService.getReceptById(id);
    }

    @Operation(summary = "Ustvari recept", description = "Shrani nov recept in njegove sestavine.")
    @ApiResponse(responseCode = "200", description = "Recept je uspešno ustvarjen",
            content = @Content(schema = @Schema(implementation = Recept.class)))
    @PostMapping
    public Recept createRecept(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Podatki recepta in njegove sestavine",
                    required = true,
                    content = @Content(schema = @Schema(implementation = Recept.class)))
            @RequestBody Recept recept) {
        return receptService.createRecept(recept);
    }

    @Operation(summary = "Posodobi recept", description = "Posodobi podatke recepta in njegov seznam sestavin.")
    @ApiResponse(responseCode = "200", description = "Recept je uspešno posodobljen",
            content = @Content(schema = @Schema(implementation = Recept.class)))
    @PutMapping("/{id}")
    public Recept updateRecept(
            @Parameter(description = "ID recepta za posodobitev", example = "1") @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Novi podatki recepta in sestavin",
                    required = true,
                    content = @Content(schema = @Schema(implementation = Recept.class)))
            @RequestBody Recept recept) {
        return receptService.updateRecept(id, recept);
    }

    @Operation(summary = "Izbriši recept", description = "Izbriše recept z navedenim ID-jem.")
    @ApiResponse(responseCode = "200", description = "Zahteva za izbris je izvedena")
    @DeleteMapping("/{id}")
    public void deleteRecept(@Parameter(description = "ID recepta za izbris", example = "1") @PathVariable Long id) {
        receptService.deleteRecept(id);
    }
}
