import * as fs from 'fs';
import * as readline from 'readline';

// Функция для чтения и разделения файла на части
async function splitFile(filePath: string, chunkSize: number): Promise<void> {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: fileStream });
    let partialData: string[] = [];
    let chunkIndex: number = 0;

    for await (const line of rl) {
        partialData.push(line);

        // Если размер собранной части превышает заданный размер, записываем ее в отдельный файл
        if (partialData.length >= chunkSize) {
            const fileName = chunk_${chunkIndex}.txt;
            fs.writeFileSync(fileName, partialData.join('\n'));
            partialData = [];
            chunkIndex++;
        }
    }

    // Записываем оставшиеся данные в последний файл
    if (partialData.length > 0) {
        const fileName = chunk_${chunkIndex}.txt;
        fs.writeFileSync(fileName, partialData.join('\n'));
    }
}

// Функция для слияния и сортировки частей
async function mergeFiles(filePattern: string): Promise<void> {
    const fileNames = fs.readdirSync('./').filter((file) => file.match(filePattern));
    const mergedData: string[] = [];

    for (const fileName of fileNames) {
        const data = fs.readFileSync(fileName, 'utf8');
        mergedData.push(...data.split('\n'));
        fs.unlinkSync(fileName);
    }

    mergedData.sort();

    fs.writeFileSync('sorted_file.txt', mergedData.join('\n'));
}

// Заданный размер оперативной памяти (в байтах)
const memoryLimit = 500 * 1024 * 1024; // 500MB

// Размер части файла, которую можно обработать в памяти (в байтах)
const chunkSize = memoryLimit / 2;

// Путь к исходному файлу
const filePath = 'input_file.txt';

// Разделение файла на части
splitFile(filePath, chunkSize)
    .then(() => mergeFiles('chunk_'))
    .then(() => console.log('Сортировка завершена. Результат сохранен в sorted_file.txt'))
    .catch((err) => console.error('Произошла ошибка:', err)); 
    
