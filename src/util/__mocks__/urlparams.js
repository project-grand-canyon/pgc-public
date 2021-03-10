import wa_9 from "../../test/fixtures/districts/wa_9.json";
import districts from "../../test/fixtures/districts/districts.json";

export default function getUrlParameter(params, name) {
    switch (name) {
        case 'district': return wa_9.number;
        case 'state': return wa_9.state;
        case 'd': return wa_9.number;
        case 't': return "23456";
        case 'c': return "7890";
        default: return null;
    }
}