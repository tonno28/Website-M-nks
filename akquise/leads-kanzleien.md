# Akquise-Recherche: Anwaltskanzleien Raum Düren / Köln / Aachen

Stand: 31.07.2026

## Kernergebnis vorweg

**Die gesuchte Liste "10 gut bewertete Kanzleien ohne Website" konnte ich nicht erstellen —
weil es dieses Segment in dieser Region praktisch nicht gibt.**

Von **15 geprüften Kanzleien hatten 15 eine eigene Domain.** Trefferquote für "keine Website": 0.

Wichtige Einschränkung zur Methodik: Ich habe über Websuche geprüft. Diese Methode findet
Kanzleien *über das Web* — also strukturell bevorzugt solche, die eine Website haben. Kanzleien
ohne Website sind für diese Methode teilweise unsichtbar. Die echte Quote liegt also nicht bei
100 %, aber sie ist sehr hoch. Genau deshalb wäre Google Maps die richtige Quelle: Dort sind
auch website-lose Betriebe gelistet, der "Website"-Button fehlt dann schlicht.

## Warum kein Firecrawl / Google Maps

In dieser Session nicht möglich:

- Kein Firecrawl-MCP-Server verbunden, kein `FIRECRAWL_API_KEY` in der Umgebung.
- Die Netzwerk-Policy der Remote-Umgebung blockiert ausgehende Verbindungen zu Drittanbieter-Hosts
  (`CONNECT tunnel failed, response 403`) — direkte API-Aufrufe scheiden aus.
- Alle deutschen Branchenverzeichnisse (Gelbe Seiten, Das Örtliche, 11880, golocal, juraforum,
  rechtsanwalt.net) liefern beim automatisierten Abruf **HTTP 403**. Auch die Kanzlei-Websites
  selbst waren nicht abrufbar.

Nutzbar war ausschließlich die Websuche. Lösung für den echten Lauf: siehe
`akquise/places-scan.mjs` — lokal ausführbar.

## Geprüfte Kanzleien (alle MIT Website)

| Kanzlei | Ort | Website |
|---|---|---|
| Anwaltskanzlei Kortz (Nicole Kortz) | Düren | anwaltskanzlei-kortz.de |
| Rechtsanwaltskanzlei Boltersdorf | Düren | kanzlei-boltersdorf.de |
| Dirk Schlenther | Düren | rechtsanwalt-schlenther.de |
| Krämer & Stockheim | Düren | kraemer-stockheim.de |
| Anwaltskanzlei Buschbell | Düren | buschbell.law + 2 weitere |
| Rudolf Hilgers | Düren | rechtsanwalt-rudolf-hilgers.de |
| Ruth Bohnenkamp | Düren | ra-bohnenkamp.de |
| Peter Thuir | Düren | rechtsanwaltskanzlei-thuir.de |
| Dr. Prochnow, Marotzke, Mohr (Lorbach, Laufer) | Düren | pmm-rechtsanwalt-dueren.de |
| Rufus Terhorst (Terhorst & Molwitz) | Aachen | kanzleiterhorst.de |
| Dirk Lintz | Aachen | kanzlei-lintz.de |
| Thorsten Galinsky (Schmitz & Lehnen) | Aachen | schmitz-lehnen.de |
| Capellmann & Thom-Capellmann | Jülich | anwaltskanzlei-capellmann.de |
| Kristina Grün | Jülich | ragruen.de |
| Klaus Schlimm (Schlimm & Trude) | Köln | ra-kanzlei-schlimm.de |
| Andreas Groß | Köln-Kalk | rechtsanwalt-andreas-gross.de |

**Nicht anrufen:** Volker Schlegel (Düren, Wirtelstr. 34) — im Januar 2024 verstorben.

## Die verwertbare Alternative: gute Bewertung + veraltete Website

Das ist das eigentlich lohnende Segment. Reihenfolge = Anrufpriorität.

> ⚠️ Die Einschätzung "veraltet" beruht auf **Signalen aus den Suchergebnissen**
> (http statt https, Frameset-Dateinamen, Freemail-Adresse, Alt-CMS-Pfade), **nicht** auf einer
> Sichtprüfung — die Websites waren aus dieser Umgebung nicht abrufbar. Vor dem Anruf kurz
> selbst im Browser öffnen.

| # | Kanzlei | Kontakt | Bewertung | Signal |
|---|---|---|---|---|
| 1 | **Anwaltskanzlei Kortz**, Nicole Kortz | Monschauer Str. 221, 52355 Düren · 02421 209170 | **5,0** — 99 (golocal), 103 (GS), 111 (Örtliche) | nur `http://`, Titel "Willkommen auf der Homepage der" → sehr alt. Bester Lead: Top-Ruf, Uralt-Auftritt |
| 2 | **Kristina Grün** | Kölnstr. 46, 52428 Jülich · 02461 9955540 | **4,9** (28–30) | Joomla (`index.php/kontakt`) + E-Mail `@t-online.de` |
| 3 | **Dirk Lintz** | Kleinmarschierstr. 40–46, 52062 Aachen · 0241 4001440 | k. A. | `http://`, Adresse+Telefon im `<title>` → 2000er-SEO |
| 4 | **Rufus Terhorst** (Terhorst & Molwitz) | Heinrichsallee 8, 52062 Aachen · 0241 500045 | **5,0** (85) | Kanzlei seit 1972, Website-Alter ungeprüft |
| 5 | **Friedrich & Schlepps** | Am Courtenbachshof 3, 52349 Düren · 02421 7800800 | **4,9** (43) | Website ungeprüft |
| 6 | **Capellmann & Thom-Capellmann** | Große Rurstr. 42, 52428 Jülich · 02461 4036 | 5,0 (1) | seit 35+ Jahren, Website ungeprüft |
| 7 | **Peter Thuir** | Markt 15, 52349 Düren · 02421 4868270 | k. A. | `ra-thuir@t-online.de` trotz eigener Domain |
| 8 | **Klaus Schlimm** (Schlimm & Trude) | Hansaring 45–47, 50670 Köln · 0221 133013 | 5,0 (1) | zwei parallele Domains, unklare Pflege |
| 9 | **Palm & Kollegen** | Trierer Str. 741–743, 52078 Aachen | **5,0** (6) | Website ungeprüft |
| 10 | **Andreas Groß** | Thumbstr. 30, 51103 Köln-Kalk · 0221 35555575 | 2,0 (4) | Frameset (`oben.html`), Dateinamen mit Leerzeichen/Umlauten → ca. 2005. Technisch bester Lead, aber schwacher Ruf |

## Weitere Kandidaten, noch ungeprüft

Eschweiler: Lingemann & Kollegen (Indestr. 89) · Wunderlich/Esser (Marienstr. 15) ·
Weihrauch und Mehr (Peter-Paul-Str. 2a) · Turhan, Mauermann, Königs & Kaiser (Marienstr. 39)
Stolberg: Andreas Smyra (Rathausstr. 16a) · Samens & Schulz (Zweifaller Str. 1–5)
Düren: Sarah Rothkopf (August-Klotz-Str. 16d) · Dr. Thomas Banse (Goethestr. 18) · Dettmeier
Aachen: Dr. Vögeli (Dresdenerstr. 8) · René Gülpen (Oligsbendengasse 22)

## Quellen

golocal.de · gelbeseiten.de · dasoertliche.de · 11880.com · anwalt.de · anwaltinfos.de ·
cylex.de · goyellow.de · trustlocal.de · rechtecheck.de
