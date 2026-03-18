// -- conversões básicas --
const ALUMINIO_POR_LATA = 3;
const SUCATA_PARA_CHAPA = 5;          // 5 sucatas -> 1 chapa de metal
const COBRE_POR_PILHA  = 2;
const ALUMINIO_PARA_ACO = 30;
const COBRE_PARA_MOLA   = 20;

// -- consumo de intermediários por arma --
const CHAPAS_CORPO_PISTOLA = 1;  // corpo de pistola também usa 1 chapa + chip
const CHAPAS_CORPO_SUB     = 3;  // corpo de sub usa 3 chapas + chip
const CHAPAS_POR_RIFLE     = 5;
const CHAPAS_POR_ESCOPETA  = 10;

const ACO_POR_PISTOLA = 1;
const ACO_POR_SUB     = 2;
const ACO_POR_RIFLE   = 3;
const ACO_POR_ESCOPETA= 5;

const MOLA_POR_PISTOLA = 1;
const MOLA_POR_SUB     = 2;
const MOLA_POR_RIFLE   = 3;
const MOLA_POR_ESCOPETA= 5;

// chips necessários por tipo de corpo/arma
const CHIPS_POR_PISTOLA = 1;      // para o corpo de pistola
const CHIPS_POR_SUB     = 1;      // para o corpo de sub
const CHIPS_POR_RIFLE    = 1;     // para o corpo de rifle
const CHIPS_POR_ESCOPETA = 1;     // para o corpo de escopeta

function toIntermediates(latas,sucata,pilhas){
    const aluminio = latas * ALUMINIO_POR_LATA;
    const chapa    = Math.floor(sucata / SUCATA_PARA_CHAPA);
    const cobre    = pilhas * COBRE_POR_PILHA;

    const aco  = Math.floor(aluminio / ALUMINIO_PARA_ACO);
    const mola = Math.floor(cobre / COBRE_PARA_MOLA);

    return {aluminio, chapa, cobre, aco, mola};
}function requiredRawFor(pistolas,subs,rifles,escopetas){
    // all quantities must be non‑negative integers
    [pistolas,subs,rifles,escopetas].forEach(q=>{if(q<0) throw new Error("Quantidades não podem ser negativas")});

    const chapa_needed =
        pistolas * CHAPAS_CORPO_PISTOLA +
        subs      * CHAPAS_CORPO_SUB +
        rifles    * CHAPAS_POR_RIFLE +
        escopetas * CHAPAS_POR_ESCOPETA;

    const aco_needed =
        pistolas * ACO_POR_PISTOLA +
        subs      * ACO_POR_SUB +
        rifles    * ACO_POR_RIFLE +
        escopetas * ACO_POR_ESCOPETA;

    const mola_needed =
        pistolas * MOLA_POR_PISTOLA +
        subs      * MOLA_POR_SUB +
        rifles    * MOLA_POR_RIFLE +
        escopetas * MOLA_POR_ESCOPETA;

    const chips_needed =
        pistolas * CHIPS_POR_PISTOLA +
        subs     * CHIPS_POR_SUB +
        rifles   * CHIPS_POR_RIFLE +
        escopetas* CHIPS_POR_ESCOPETA;

    const aluminio_needed = aco_needed * ALUMINIO_PARA_ACO;
    const latas_needed    = aluminio_needed > 0 ? Math.ceil(aluminio_needed / ALUMINIO_POR_LATA) : 0;
    const sucata_needed   = chapa_needed * SUCATA_PARA_CHAPA;
    const cobre_needed    = mola_needed * COBRE_PARA_MOLA;
    const pilhas_needed   = cobre_needed > 0 ? Math.ceil(cobre_needed / COBRE_POR_PILHA) : 0;

    return {
        pistolas,
        subs,
        rifles,
        escopetas,
        chapa_needed,
        aco_needed,
        mola_needed,
        chips_needed,
        aluminio_needed,
        latas_needed,
        sucata_needed,
        cobre_needed,
        pilhas_needed
    };
}function maxOnlyPistolas(inv){
    return Math.min(
        Math.floor(inv.chapa / CHAPAS_CORPO_PISTOLA),
        Math.floor(inv.aco   / ACO_POR_PISTOLA),
        Math.floor(inv.mola  / MOLA_POR_PISTOLA)
    );
}

function maxOnlySubs(inv){
    return Math.min(
        Math.floor(inv.chapa / CHAPAS_CORPO_SUB),
        Math.floor(inv.aco   / ACO_POR_SUB),
        Math.floor(inv.mola  / MOLA_POR_SUB)
    );
}

function maxOnlyRifles(inv){
    return Math.min(
        Math.floor(inv.chapa / CHAPAS_POR_RIFLE),
        Math.floor(inv.aco   / ACO_POR_RIFLE),
        Math.floor(inv.mola  / MOLA_POR_RIFLE)
    );
}

function maxOnlyEscopetas(inv){
    return Math.min(
        Math.floor(inv.chapa / CHAPAS_POR_ESCOPETA),
        Math.floor(inv.aco   / ACO_POR_ESCOPETA),
        Math.floor(inv.mola  / MOLA_POR_ESCOPETA)
    );
}function bestCombination(inv){
    // brute-force search for any combination that maximizes total quantity
    const best = {p:0, s:0, r:0, e:0, total:0};

    const maxP = Math.floor(inv.chapa / CHAPAS_CORPO_PISTOLA);
    const maxS = Math.floor(inv.chapa / CHAPAS_CORPO_SUB);
    const maxR = Math.floor(inv.chapa / CHAPAS_POR_RIFLE);
    const maxE = Math.floor(inv.chapa / CHAPAS_POR_ESCOPETA);

    for (let p = 0; p <= maxP; p++) {
        for (let s = 0; s <= maxS; s++) {
            for (let r = 0; r <= maxR; r++) {
                for (let e = 0; e <= maxE; e++) {
                    const chapaNeeded = p * CHAPAS_CORPO_PISTOLA +
                                         s * CHAPAS_CORPO_SUB +
                                         r * CHAPAS_POR_RIFLE +
                                         e * CHAPAS_POR_ESCOPETA;
                    const acoNeeded = p * ACO_POR_PISTOLA +
                                      s * ACO_POR_SUB +
                                      r * ACO_POR_RIFLE +
                                      e * ACO_POR_ESCOPETA;
                    const molaNeeded = p * MOLA_POR_PISTOLA +
                                       s * MOLA_POR_SUB +
                                       r * MOLA_POR_RIFLE +
                                       e * MOLA_POR_ESCOPETA;
                    const chipsNeeded = p * CHIPS_POR_PISTOLA +
                                        s * CHIPS_POR_SUB +
                                        r * CHIPS_POR_RIFLE +
                                        e * CHIPS_POR_ESCOPETA;

                    if (chapaNeeded <= inv.chapa &&
                        acoNeeded   <= inv.aco   &&
                        molaNeeded  <= inv.mola) {

                        const total = p + s + r + e;
                        if (total > best.total) {
                            best.p = p;
                            best.s = s;
                            best.r = r;
                            best.e = e;
                            best.total = total;
                        }
                    }
                }
            }
        }
    }

    return best;
}

// helper to quickly grab elements
const el = id => document.getElementById(id);

function printInv(inv) {
    const inter = toIntermediates(inv.latas, inv.sucata, inv.pilhas);
    const maxP = maxOnlyPistolas(inter);
    const maxS = maxOnlySubs(inter);
    const maxR = maxOnlyRifles(inter);
    const maxE = maxOnlyEscopetas(inter);
    const best = bestCombination(inter);

    return `=== Inventário inicial ===
Latas: ${inv.latas}
Sucata: ${inv.sucata}
Pilhas: ${inv.pilhas}

=== Intermediários disponíveis ===
Alumínio: ${inter.aluminio}
Chapas de metal: ${inter.chapa}
Cobre: ${inter.cobre}
Aço forgado: ${inter.aco}
Molas: ${inter.mola}

=== Produção possível (unidades máximas) ===
Pistolas: ${maxP}
Subs: ${maxS}
Rifles: ${maxR}
Escopetas: ${maxE}

=== Melhor combinação (maximizar total de armas) ===
Pistolas: ${best.p}  |  Subs: ${best.s}  |  Rifles: ${best.r}  |  Escopetas: ${best.e}  |  Total: ${best.total}`;
}

function printReq(req) {
    return `=== Requisitos para produzir ===
Pistolas: ${req.pistolas}
Subs: ${req.subs}
Rifles: ${req.rifles}
Escopetas: ${req.escopetas}

--- Intermediários necessários ---
Chapas de metal: ${req.chapa_needed}
Aço forgado: ${req.aco_needed}
Molas: ${req.mola_needed}
Chips necessários: ${req.chips_needed}

--- Matéria-prima bruta mínima necessária ---
Alumínio total necessário: ${req.aluminio_needed}
Latas necessárias: ${req.latas_needed}
Sucata (unidades) necessárias: ${req.sucata_needed}
Cobre total necessário: ${req.cobre_needed}
Pilhas necessárias: ${req.pilhas_needed}`;
}

window.addEventListener("DOMContentLoaded", () => {
    el("btn-calc-inv").addEventListener("click", () => {
        const inv = {
            latas: parseInt(el("in-latas").value || 0, 10),
            sucata: parseInt(el("in-sucata").value || 0, 10),
            pilhas: parseInt(el("in-pilhas").value || 0, 10)
        };
        el("out-inv").textContent = printInv(inv);
    });

    el("btn-require").addEventListener("click", () => {
        const p = parseInt(el("in-pistolas").value || 0, 10);
        const s = parseInt(el("in-subs").value || 0, 10);
        const r = parseInt(el("in-rifles").value || 0, 10);
        const e = parseInt(el("in-escopetas").value || 0, 10);
        try {
            const req = requiredRawFor(p, s, r, e);
            el("out-req").textContent = printReq(req);
        } catch (err) {
            el("out-req").textContent = "Erro: " + err.message;
        }
    });

    el("btn-per-unit").addEventListener("click", () => {
        const a = requiredRawFor(1, 0, 0, 0);
        const b = requiredRawFor(0, 1, 0, 0);
        const c = requiredRawFor(0, 0, 1, 0);
        const d = requiredRawFor(0, 0, 0, 1);
        el("out-req").textContent = `=== Requisitos por unidade ===

-- 1 Pistola --
${printReq(a)}

-- 1 Sub --
${printReq(b)}

-- 1 Rifle --
${printReq(c)}

-- 1 Escopeta --
${printReq(d)}`;
    });
});