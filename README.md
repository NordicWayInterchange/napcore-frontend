# NAPCORE

## Grunnlag for applikasjonen

Vi ønsker med denne applikasjonen å være et grensesnitt inn mot interchange som
skal gjøre aktører i stand til å sette opp abonnement mot data de ønsker
å konsumerer.

Vi skal tilrettelegge slik at de skal kunne opprette køer, og i størst mulig
grad støtte dem i oppretting av disse slik at de finner frem til de dataene de
ønsker å motta.

## Teknologi

Vi benytter oss av NextJS 13 som rammeverk for applikasjonen med MUI som base
for CSS og grunnleggende react komponenter. For støtte av QuadTrees vil vi bruke
Leaflet.

## Miljø

### Nøkler

For at vi skal kunne knytte apiet til interchange trenger vi at man setter de to miljøvariablene:

`PFX_KEY_FILENAME` - som gir navnet på pfx nøkkel som ligger i roten av prosjektet.
`PFX_PASSPHRASE\*\* - Som gir passphrase for å åpne nøkkel

### Kopi av .env.local

```
PFX_KEY_FILENAME=
PFX_PASSPHRASE=
NODE_TLS_REJECT_UNAUTHORIZED='0'
INTERCHANGE_URI=https://bouvet.pilotinterchange.eu:4141/
```
