import {parse, transform, stringify} from 'csv/sync';

export function csvArray2Str(csv: string[][]): string {
    return stringify(csv)
}

export function oneLineCsvStr2Array(txt: string): string[] {
    let result: string[] = []
    if (!txt) { return result }

    try {
        const rawRecords = parse(txt);
        let data: any = transform(rawRecords, function(data){
            return data
        });
        result = data[0]
    } catch (error) {
        result.push(txt)
    }

    return result
}

export function csvStr2Array(txt: string): string[][] {
    if (!txt) { return [[]] }

    let result: string[][]= []
    txt.split(/\n|\r\n/).forEach(item => {
        try {
            const rawRecords = parse(item);
            let data: any = transform(rawRecords, function(data){
                return data
            })
            result.push(data[0])
        } catch (error) {
            result.push([item])
        }
    });

    if (result.length === 0) { result = [[]] }

    return result
}
