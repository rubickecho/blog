import path from 'path';
import fs from 'fs';
import fileSave from 'file-save';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dayjs from "dayjs";

const init = () => {
}

const usePath = (...dirs) => {
	return path.resolve(process.cwd(), ...dirs);
};

const currentDate = dayjs().format("YYYY-MM-DD");

const askQuestions = () => {
	const questions = [
	  {
		name: "filename",
		type: "input",
		message: "please input filename"
	  },
	  {
		name: "title",
		type: "input",
		message: "please input article title",
	  },
	  {
		name: "description",
		type: "input",
		message: "please input article description",
	  },
	  {
		name: "tags",
		type: "input",
		message: "please input article tags(separated by comma[,])",
	  },
	  {
		name: "confirm",
		type: "confirm",
		message: `confirm create article?`,
	}];
	return inquirer.prompt(questions);
};

const getArticleTags = (str) => {
	if (!str) return [];
	return str.split(',').map(tag => tag.trim()).join(',');
}

const createFile = (filename, title, description, tags) => {
	const dirName = `${currentDate}-${filename}`;
	const articlePath = path.resolve(usePath('./', 'content/posts', dirName));
	const articleTags = getArticleTags(tags);
	// 检查文件是否存在于当前目录中。
	fs.access(articlePath, fs.constants.F_OK, (err) => {
		if (!err) {
			console.error('[%s] already exists, please check', articlePath);
			process.exit(1);
		} else {
			const Files = [
			{
				filename: 'index.mdx',
				dirName: dirName,
				content: `---
title: ${title}
date: ${currentDate}
description: ${description}
defer: false
tags: [${articleTags}]
---`
			},
		];
		console.log('Files:', Files)
		Files.forEach(file => {
			fileSave(path.join(articlePath, file.filename))
			.write(file.content, 'utf8')
			.end('\n');
		});

		console.log(
			chalk.white.bgGreen.bold(`Done! File created at ${dirName}`)
		);
	}})
};

// 执行
const run = async () => {
	// show script introduction
	init()

	// ask questions
	const answers = await askQuestions();
	const { filename, title, description, tags, confirm } = answers;

	// create the file
	if(confirm) createFile(filename, title, description, tags);
};

run();
